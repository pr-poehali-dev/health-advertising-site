import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface OrderFormProps {
  onClose: () => void;
  initialService?: string;
}

const OrderForm = ({ onClose, initialService = '' }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService,
    category: '',
    description: '',
    urgency: 'standard',
    contactMethod: 'email',
    agreedToTerms: false,
    volume: 'small'
  });

  const services = [
    { value: 'healing', label: 'Лечебные настрои', icon: 'Heart', basePrice: 3000 },
    { value: 'texts', label: 'Создание текстов', icon: 'PenTool', basePrice: 1500 },
    { value: 'poetry', label: 'Стихи и поздравления', icon: 'BookOpen', basePrice: 2000 },
    { value: 'scripts', label: 'Сценарии мероприятий', icon: 'FileText', basePrice: 5000 }
  ];

  const categories = {
    healing: ['Здоровье', 'Отношения', 'Финансы', 'Карьера', 'Духовность', 'Энергия'],
    texts: ['Социальные сети', 'Реклама', 'Блог статьи', 'Коммерческие тексты', 'Презентации'],
    poetry: ['День рождения', 'Свадьба', 'Юбилей', 'Любовная лирика', 'Детские стихи'],
    scripts: ['Корпоратив', 'День рождения', 'Свадьба', 'Выпускной', 'Новый год']
  };

  const volumeOptions = {
    healing: [
      { value: 'small', label: '1 настрой (до 15 мин)', multiplier: 1 },
      { value: 'medium', label: '3 настроя (до 45 мин)', multiplier: 2.5 },
      { value: 'large', label: '5 настроев (до 90 мин)', multiplier: 4 }
    ],
    texts: [
      { value: 'small', label: 'Короткий текст (до 500 слов)', multiplier: 1 },
      { value: 'medium', label: 'Средний текст (до 1500 слов)', multiplier: 2 },
      { value: 'large', label: 'Большой текст (до 3000 слов)', multiplier: 3.5 }
    ],
    poetry: [
      { value: 'small', label: '1 стихотворение', multiplier: 1 },
      { value: 'medium', label: '3-5 стихотворений', multiplier: 2.2 },
      { value: 'large', label: 'Поэтический сборник (10+ стихов)', multiplier: 4 }
    ],
    scripts: [
      { value: 'small', label: 'Короткий сценарий (до 30 мин)', multiplier: 1 },
      { value: 'medium', label: 'Полный сценарий (1-2 часа)', multiplier: 2 },
      { value: 'large', label: 'Развернутый сценарий (3+ часа)', multiplier: 3 }
    ]
  };

  const calculatePrice = () => {
    if (!formData.service) return 0;
    
    const service = services.find(s => s.value === formData.service);
    if (!service) return 0;
    
    const volumeOption = volumeOptions[formData.service as keyof typeof volumeOptions]?.find(v => v.value === formData.volume);
    if (!volumeOption) return 0;
    
    let basePrice = service.basePrice * volumeOption.multiplier;
    
    // Добавляем наценку за срочность
    if (formData.urgency === 'fast') {
      basePrice *= 1.5;
    } else if (formData.urgency === 'urgent') {
      basePrice *= 2;
    }
    
    return Math.round(basePrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Пожалуйста, согласитесь с условиями оказания услуг');
      return;
    }
    
    const finalPrice = calculatePrice();
    console.log('Заказ отправлен:', { ...formData, estimatedPrice: finalPrice });
    alert(`Спасибо за заказ! Предварительная стоимость: ${finalPrice.toLocaleString()} ₽. Мы свяжемся с вами в ближайшее время.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Заказать услугу</CardTitle>
            <CardDescription>
              Заполните форму, и мы подготовим персональное предложение
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Личные данные */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Icon name="User" className="mr-2" size={20} />
                Контактная информация
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Выбор услуги */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Icon name="Star" className="mr-2" size={20} />
                Выберите услугу
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                {services.map((service) => (
                  <Card 
                    key={service.value}
                    className={`cursor-pointer transition-all ${
                      formData.service === service.value 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setFormData({...formData, service: service.value, category: ''})}
                  >
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center">
                        <Icon name={service.icon} size={20} className="text-white" />
                      </div>
                      <span className="font-medium">{service.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Категория и объем */}
            {formData.service && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Тематика</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тематику" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[formData.service as keyof typeof categories]?.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Объем работы</Label>
                    <Select value={formData.volume} onValueChange={(value) => setFormData({...formData, volume: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите объем" />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeOptions[formData.service as keyof typeof volumeOptions]?.map((volume) => (
                          <SelectItem key={volume.value} value={volume.value}>{volume.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Описание */}
            <div className="space-y-4">
              <Label htmlFor="description">Подробное описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Опишите ваши пожелания, цели, особенности задачи..."
                rows={4}
                required
              />
            </div>

            {/* Срочность */}
            <div className="space-y-4">
              <Label>Срочность выполнения</Label>
              <RadioGroup 
                value={formData.urgency} 
                onValueChange={(value) => setFormData({...formData, urgency: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Стандартно (5-7 дней)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fast" id="fast" />
                  <Label htmlFor="fast">Быстро (2-3 дня) +50% к стоимости</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent">Срочно (24 часа) +100% к стоимости</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Способ связи */}
            <div className="space-y-4">
              <Label>Предпочтительный способ связи</Label>
              <RadioGroup 
                value={formData.contactMethod} 
                onValueChange={(value) => setFormData({...formData, contactMethod: value})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-contact" />
                  <Label htmlFor="email-contact">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone-contact" />
                  <Label htmlFor="phone-contact">Телефон</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telegram" id="telegram" />
                  <Label htmlFor="telegram">Telegram</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Калькулятор стоимости */}
            {formData.service && (
              <Card className="bg-gradient-to-r from-purple-50 to-green-50 border-purple-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icon name="Calculator" className="mr-2" size={20} />
                    Расчет стоимости
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Базовая стоимость:</span>
                      <span className="font-medium">
                        {services.find(s => s.value === formData.service)?.basePrice.toLocaleString()} ₽
                      </span>
                    </div>
                    
                    {formData.volume !== 'small' && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Объем работы:</span>
                        <span className="font-medium">
                          ×{volumeOptions[formData.service as keyof typeof volumeOptions]?.find(v => v.value === formData.volume)?.multiplier || 1}
                        </span>
                      </div>
                    )}
                    
                    {formData.urgency !== 'standard' && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Срочность:</span>
                        <span className="font-medium text-orange-600">
                          +{formData.urgency === 'fast' ? '50%' : '100%'}
                        </span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {calculatePrice().toLocaleString()} ₽
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        *Окончательная стоимость может быть скорректирована после обсуждения деталей
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Согласие */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: !!checked})}
              />
              <Label htmlFor="terms" className="text-sm">
                Соглашаюсь с условиями оказания услуг и обработкой персональных данных
              </Label>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={!formData.service || calculatePrice() === 0}>
                <Icon name="Send" className="mr-2" size={16} />
                Отправить заказ {formData.service && `(${calculatePrice().toLocaleString()} ₽)`}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
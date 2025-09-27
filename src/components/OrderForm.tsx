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
    agreedToTerms: false
  });

  const services = [
    { value: 'healing', label: 'Лечебные настрои', icon: 'Heart' },
    { value: 'texts', label: 'Создание текстов', icon: 'PenTool' },
    { value: 'poetry', label: 'Стихи и поздравления', icon: 'BookOpen' },
    { value: 'scripts', label: 'Сценарии мероприятий', icon: 'FileText' }
  ];

  const categories = {
    healing: ['Здоровье', 'Отношения', 'Финансы', 'Карьера', 'Духовность', 'Энергия'],
    texts: ['Социальные сети', 'Реклама', 'Блог статьи', 'Коммерческие тексты', 'Презентации'],
    poetry: ['День рождения', 'Свадьба', 'Юбилей', 'Любовная лирика', 'Детские стихи'],
    scripts: ['Корпоратив', 'День рождения', 'Свадьба', 'Выпускной', 'Новый год']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Пожалуйста, согласитесь с условиями оказания услуг');
      return;
    }
    
    console.log('Заказ отправлен:', formData);
    alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
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

            {/* Категория */}
            {formData.service && (
              <div className="space-y-4">
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
              <Button type="submit" className="flex-1">
                <Icon name="Send" className="mr-2" size={16} />
                Отправить заказ
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